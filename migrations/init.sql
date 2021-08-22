CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE user_role AS ENUM ('user', 'developer');
CREATE TYPE tenant_type AS ENUM ('organisation', 'consumer');

CREATE OR REPLACE FUNCTION create_tenant_tables() 
RETURNS trigger AS $$
  BEGIN
    EXECUTE format('
      CREATE SCHEMA "%s"
        CREATE TABLE applications (
          id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
          name varchar NOT NULL,
          redirect_uri varchar NOT NULL,
          is_public boolean NOT NULL DEFAULT false,
          scope varchar
        )
    ', NEW.id);
    
    RETURN NEW;
  END;
$$ LANGUAGE 'plpgsql';

CREATE TABLE tenants (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name varchar NOT NULL,
  domain varchar NOT NULL UNIQUE
);

CREATE TRIGGER tenant_trigger AFTER INSERT 
ON public.tenants 
FOR EACH ROW 
EXECUTE PROCEDURE create_tenant_tables();

CREATE TABLE users (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name varchar NOT NULL,
  last_name varchar NOT NULL,
  email varchar NOT NULL UNIQUE,
  passwordHash varchar NOT NULL,
  nickname varchar
);

INSERT INTO tenants(name, domain)
VALUES ('Test Tenant', 'test');

-- CREATE TABLE user_application_associations (
--   id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
--   user_id uuid REFERENCES users(id),
--   application_id uuid REFERENCES applications(id)
-- );

-- Pre populate some test data

-- <domain>/<tenant>/oauth/v2.0/authorize
-- client_id
-- 