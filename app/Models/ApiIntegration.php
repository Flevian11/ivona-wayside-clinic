<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class ApiIntegration extends Model {
 protected $fillable=['name','slug','provider','direction','base_url','token_url','auth_method','client_id','client_secret','scopes','status','notes','updated_by'];
 protected $hidden=['client_secret'];
 protected function casts(): array { return ['client_secret'=>'encrypted','scopes'=>'array']; }
 public function environments(): HasMany { return $this->hasMany(ApiIntegrationEnvironment::class,'api_integration_id'); }
 public function environment(string $environment): ?ApiIntegrationEnvironment { return $this->environments()->where('environment',$environment)->first(); }
}
