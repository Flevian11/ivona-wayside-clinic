<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApiIntegrationEnvironment extends Model
{
    protected $fillable = ['api_integration_id','environment','base_url','token_url','auth_method','client_id','client_secret','scopes','enabled','agent_id','facility_id','facility_id_type','username','password','consumer_key','consumer_secret','private_key','public_key','provider_public_key','client_certificate','client_certificate_key','callback_url','validation_url','endpoint_map','encrypted_operations','verify_tls'];
    protected $hidden = ['client_secret','password','consumer_secret','private_key','client_certificate_key'];

    protected function casts(): array
    {
        return [
            'client_secret' => 'encrypted', 'password' => 'encrypted', 'consumer_secret' => 'encrypted',
            'private_key' => 'encrypted', 'client_certificate_key' => 'encrypted', 'scopes' => 'array',
            'endpoint_map' => 'array', 'encrypted_operations' => 'array', 'enabled' => 'boolean', 'verify_tls' => 'boolean',
        ];
    }

    public function integration(): BelongsTo { return $this->belongsTo(ApiIntegration::class, 'api_integration_id'); }
}
