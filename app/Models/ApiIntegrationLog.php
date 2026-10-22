<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class ApiIntegrationLog extends Model {
 public $timestamps=false;
 protected $fillable=['api_integration_id','user_id','environment','operation','http_status','result','duration_ms','safe_message','created_at'];
 protected function casts(): array { return ['created_at'=>'datetime']; }
 public function integration(): BelongsTo { return $this->belongsTo(ApiIntegration::class,'api_integration_id'); }
}
