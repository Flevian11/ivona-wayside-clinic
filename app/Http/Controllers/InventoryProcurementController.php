<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class InventoryProcurementController extends Controller
{
    public function inventory(Request $request): Response
    {
        $term = trim((string) $request->query('q', ''));
        $category = trim((string) $request->query('category', ''));
        $status = trim((string) $request->query('stock', ''));
        $base = DB::table('inventory_items')->where('is_active', true);
        if ($term !== '') $base->where(fn ($q) => $q->where('name', 'like', "%{$term}%")->orWhere('sku', 'like', "%{$term}%")->orWhere('supplier_name', 'like', "%{$term}%"));
        if ($category !== '') $base->where('category', $category);
        if ($status === 'low') $base->whereColumn('quantity_on_hand', '<=', 'reorder_level');
        if ($status === 'available') $base->whereColumn('quantity_on_hand', '>', 'reorder_level');
        $summary = [
            'items' => (int) DB::table('inventory_items')->where('is_active', true)->count(),
            'low_stock' => (int) DB::table('inventory_items')->where('is_active', true)->whereColumn('quantity_on_hand', '<=', 'reorder_level')->count(),
            'stock_value' => (float) DB::table('inventory_items')->where('is_active', true)->selectRaw('COALESCE(SUM(quantity_on_hand * unit_cost), 0) as value')->value('value'),
            'pending_requests' => (int) DB::table('procurement_requests')->whereIn('status', ['pending', 'approved', 'ordered'])->count(),
        ];
        $items = $base->orderByRaw('CASE WHEN quantity_on_hand <= reorder_level THEN 0 ELSE 1 END')->orderBy('name')->paginate(15)->withQueryString();
        $categories = DB::table('inventory_items')->where('is_active', true)->whereNotNull('category')->distinct()->orderBy('category')->pluck('category')->values();
        $movements = DB::table('inventory_movements as m')->join('inventory_items as i', 'i.id', '=', 'm.inventory_item_id')->leftJoin('users as u', 'u.id', '=', 'm.performed_by')->select('m.id','m.movement_type','m.quantity_change','m.balance_after','m.reference','m.created_at','i.name as item_name','i.sku','u.name as performed_by')->latest('m.created_at')->limit(8)->get();
        return Inertia::render('inventory/index', ['summary' => $summary, 'items' => $items, 'categories' => $categories, 'movements' => $movements, 'filters' => ['q'=>$term,'category'=>$category,'stock'=>$status]]);
    }

    public function storeItem(Request $request): RedirectResponse
    {
        abort_unless($request->user()?->can('inventory.manage'), 403);
        $data = $request->validate([
            'sku' => ['required','string','max:80','unique:inventory_items,sku'],
            'name' => ['required','string','max:180'], 'category' => ['nullable','string','max:100'],
            'unit' => ['required','string','max:40'], 'quantity_on_hand' => ['required','numeric','min:0'],
            'reorder_level' => ['required','numeric','min:0'], 'unit_cost' => ['required','numeric','min:0'],
            'location' => ['nullable','string','max:120'], 'supplier_name' => ['nullable','string','max:180'],
        ]);
        $data['created_by'] = $request->user()->id; $data['updated_by'] = $request->user()->id; $data['created_at'] = now(); $data['updated_at'] = now();
        $id = DB::table('inventory_items')->insertGetId($data);
        if ((float) $data['quantity_on_hand'] > 0) DB::table('inventory_movements')->insert(['inventory_item_id'=>$id,'movement_type'=>'opening_balance','quantity_change'=>$data['quantity_on_hand'],'balance_after'=>$data['quantity_on_hand'],'reference'=>'OPENING','notes'=>'Opening stock recorded when item was created.','performed_by'=>$request->user()->id,'created_at'=>now(),'updated_at'=>now()]);
        return back()->with('success', 'Inventory item created.');
    }

    public function adjustStock(Request $request, int $item): RedirectResponse
    {
        abort_unless($request->user()?->can('inventory.manage'), 403);
        $data = $request->validate(['direction'=>['required',Rule::in(['in','out'])],'quantity'=>['required','numeric','gt:0'],'reference'=>['nullable','string','max:120'],'notes'=>['nullable','string','max:2000']]);
        return DB::transaction(function () use ($request, $item, $data) {
            $record = DB::table('inventory_items')->where('id',$item)->lockForUpdate()->first(); abort_unless($record && $record->is_active, 404);
            $change = (float) $data['quantity'] * ($data['direction'] === 'in' ? 1 : -1); $balance = (float) $record->quantity_on_hand + $change;
            abort_if($balance < 0, 422, 'Stock cannot be reduced below zero.');
            DB::table('inventory_items')->where('id',$item)->update(['quantity_on_hand'=>$balance,'updated_by'=>$request->user()->id,'updated_at'=>now()]);
            DB::table('inventory_movements')->insert(['inventory_item_id'=>$item,'movement_type'=>$data['direction']==='in'?'stock_in':'stock_out','quantity_change'=>$change,'balance_after'=>$balance,'reference'=>$data['reference'] ?? null,'notes'=>$data['notes'] ?? null,'performed_by'=>$request->user()->id,'created_at'=>now(),'updated_at'=>now()]);
            return back()->with('success','Stock movement recorded.');
        });
    }

    public function procurement(Request $request): Response
    {
        $term = trim((string) $request->query('q', '')); $status = trim((string) $request->query('status', ''));
        $query = DB::table('procurement_requests as p')->leftJoin('users as requester','requester.id','=','p.requested_by')->leftJoin('users as reviewer','reviewer.id','=','p.reviewed_by')->select('p.*','requester.name as requester_name','reviewer.name as reviewer_name');
        if ($term !== '') $query->where(fn ($q) => $q->where('p.request_number','like',"%{$term}%")->orWhere('p.item_description','like',"%{$term}%")->orWhere('p.supplier_name','like',"%{$term}%"));
        if ($status !== '') $query->where('p.status',$status);
        $summary = [
            'total' => (int) DB::table('procurement_requests')->count(),
            'pending' => (int) DB::table('procurement_requests')->where('status','pending')->count(),
            'approved' => (int) DB::table('procurement_requests')->whereIn('status',['approved','ordered'])->count(),
            'received' => (int) DB::table('procurement_requests')->where('status','received')->count(),
            'estimated_value' => (float) DB::table('procurement_requests')->whereNotIn('status',['rejected','cancelled'])->selectRaw('COALESCE(SUM(quantity * COALESCE(estimated_unit_cost,0)),0) as value')->value('value'),
        ];
        $requests = $query->orderByRaw("CASE p.status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 WHEN 'ordered' THEN 2 ELSE 3 END")->latest('p.created_at')->paginate(15)->withQueryString();
        return Inertia::render('procurement/index',['summary'=>$summary,'requests'=>$requests,'filters'=>['q'=>$term,'status'=>$status]]);
    }

    public function storeRequest(Request $request): RedirectResponse
    {
        abort_unless($request->user()?->can('procurement.manage'), 403);
        $data = $request->validate(['item_description'=>['required','string','max:180'],'category'=>['nullable','string','max:100'],'quantity'=>['required','numeric','gt:0'],'unit'=>['required','string','max:40'],'estimated_unit_cost'=>['nullable','numeric','min:0'],'supplier_name'=>['nullable','string','max:180'],'priority'=>['required',Rule::in(['low','normal','high','urgent'])],'justification'=>['nullable','string','max:4000']]);
        $data['request_number'] = 'PR-' . now()->format('ymd') . '-' . strtoupper(substr(bin2hex(random_bytes(4)),0,6)); $data['status']='pending'; $data['requested_by']=$request->user()->id; $data['created_at']=now(); $data['updated_at']=now();
        DB::table('procurement_requests')->insert($data);
        return back()->with('success','Procurement request submitted for review.');
    }

    public function reviewRequest(Request $request, int $procurementRequest): RedirectResponse
    {
        abort_unless($request->user()?->can('procurement.approve'), 403);
        $data = $request->validate([
            'decision' => ['required', Rule::in(['approved', 'rejected', 'ordered', 'received'])],
            'review_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        DB::transaction(function () use ($request, $procurementRequest, $data): void {
            $row = DB::table('procurement_requests')->where('id', $procurementRequest)->lockForUpdate()->first();
            abort_unless($row, 404);
            $allowed = ['pending' => ['approved', 'rejected'], 'approved' => ['ordered', 'rejected'], 'ordered' => ['received']];
            abort_unless(in_array($data['decision'], $allowed[$row->status] ?? [], true), 422, 'This procurement status transition is not allowed.');

            DB::table('procurement_requests')->where('id', $procurementRequest)->update([
                'status' => $data['decision'],
                'review_notes' => $data['review_notes'] ?? null,
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
                'received_at' => $data['decision'] === 'received' ? now() : $row->received_at,
                'updated_at' => now(),
            ]);

            if ($data['decision'] !== 'received') return;

            $item = DB::table('inventory_items')->whereRaw('LOWER(name) = ?', [mb_strtolower($row->item_description)])->where('is_active', true)->first();
            if (!$item) {
                $sku = 'PR-' . preg_replace('/[^A-Z0-9-]/', '', strtoupper($row->request_number));
                $itemId = DB::table('inventory_items')->insertGetId([
                    'sku' => substr($sku, 0, 80),
                    'name' => $row->item_description,
                    'category' => $row->category,
                    'unit' => $row->unit,
                    'quantity_on_hand' => 0,
                    'reorder_level' => 0,
                    'unit_cost' => $row->estimated_unit_cost ?? 0,
                    'supplier_name' => $row->supplier_name,
                    'is_active' => true,
                    'created_by' => $request->user()->id,
                    'updated_by' => $request->user()->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $item = DB::table('inventory_items')->where('id', $itemId)->first();
            }

            $locked = DB::table('inventory_items')->where('id', $item->id)->lockForUpdate()->first();
            $newBalance = (float) $locked->quantity_on_hand + (float) $row->quantity;
            DB::table('inventory_items')->where('id', $locked->id)->update([
                'quantity_on_hand' => $newBalance,
                'updated_by' => $request->user()->id,
                'updated_at' => now(),
            ]);
            DB::table('inventory_movements')->insert([
                'inventory_item_id' => $locked->id,
                'movement_type' => 'procurement_receipt',
                'quantity_change' => $row->quantity,
                'balance_after' => $newBalance,
                'reference' => $row->request_number,
                'notes' => 'Received from procurement request.',
                'performed_by' => $request->user()->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        return back()->with('success', 'Procurement request updated.');
    }
}

