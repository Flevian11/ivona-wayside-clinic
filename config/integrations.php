<?php

return [
    'environment' => env('IWC_INTEGRATION_ENVIRONMENT', env('APP_ENV') === 'production' ? 'production' : 'development'),
    'timeout_seconds' => (int) env('IWC_INTEGRATION_TIMEOUT', 20),
    'connect_timeout_seconds' => (int) env('IWC_INTEGRATION_CONNECT_TIMEOUT', 5),
    'mock_seed' => env('IWC_INTEGRATION_MOCK_SEED', 'ivona-wayside-clinic-dev-v1'),
    'providers' => [
        'sha_edi' => ['name' => 'Social Health Authority — EDI / claims', 'urls' => ['development' => 'https://edi-api.provider-dev.sha.go.ke', 'uat' => 'https://edi-api.provider-uat.sha.go.ke', 'production' => 'https://api-edi.provider.sha.go.ke'], 'documentation' => 'https://api-edi.provider.sha.go.ke/'],
        'dha_hie' => ['name' => 'Digital Health Agency — AfyaConnect / HIE', 'documentation' => 'https://afyaconnect.dha.go.ke/get-started', 'api_catalog' => 'https://afyaconnect.dha.go.ke/', 'claims_documentation' => 'https://afyaconnect.dha.go.ke/docs/eclaims/getting-started/introduction'],
        'afyalink' => ['name' => 'DHA AfyaLink — HIE registries', 'documentation' => 'https://afyalink.dha.go.ke/apidocs/getting-started', 'authentication_documentation' => 'https://afyalink.dha.go.ke/apidocs/authentication', 'security_documentation' => 'https://afyalink.dha.go.ke/api-authentication-encryption'],
    ],
];
