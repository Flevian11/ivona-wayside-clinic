<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class InboundApiKey extends Model {
 protected $fillable=['name','prefix','token_hash','scopes','environment','expires_at','last_used_at','revoked_at','created_by'];
 protected $hidden=['token_hash'];
 protected function casts(): array { return ['scopes'=>'array','expires_at'=>'datetime','last_used_at'=>'datetime','revoked_at'=>'datetime']; }
 public function isUsable(): bool { return $this->revoked_at===null && ($this->expires_at===null || $this->expires_at->isFuture()); }
}
