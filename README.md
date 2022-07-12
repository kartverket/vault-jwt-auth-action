# Authenticate with vault

This action authenticates with Hashicorp vault with github jwt token, and puts resulting token i env as `VAULT_TOKEN` on runner. 

## Inputs

## Vaultaddr (required)

Address to access vault via from runner.

Default: https://vault.vault:8200

## Path (required)

The name of hte jwt authentication method you wish to use in vault.

## Role (required)

Name of role in jwt authentication method in vault.

## Certb64 (optional)

If you need a ca to verify the certificate used on the vault server, you can add it here as a base64 encoded string.

## Example usage

    - name: Vault Auth
      uses: BardOve/actions@v1.0.0
      with:
        vaultaddr: 'https://vault.dev:8200'
        path: jwt-dev
        role: test-role
        certb64: 'LS0tLS1CRUdJTiBDRVJUSUZ...'
