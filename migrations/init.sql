CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.tenants (
  id uuid DEFAULT uuid_generate_v4 (),
  name varchar NOT NULL UNIQUE,
  PRIMARY KEY (id)
);

CREATE TABLE public.users (
  id uuid DEFAULT uuid_generate_v4 (),
  tenant_id uuid NOT NULL,
  name varchar NOT NULL UNIQUE,
  PRIMARY KEY (id),
  CONSTRAINT fk_tenant
    FOREIGN KEY(tenant_id) 
    REFERENCES public.tenants(id)
);

-- Pre populate some test data
INSERT INTO public.tenants (id, name)
VALUES ('0e995960-7b05-421b-9b4b-de36dc1edcee', 'Test Company');

INSERT INTO public.users(tenant_id, name)
VALUES ('0e995960-7b05-421b-9b4b-de36dc1edcee', 'Test User');

CREATE SCHEMA "0e995960-7b05-421b-9b4b-de36dc1edcee";
CREATE TABLE "0e995960-7b05-421b-9b4b-de36dc1edcee".books (
  id uuid DEFAULT uuid_generate_v4 (),
  title varchar NOT NULL,
  author_last_name varchar NOT NULL,
  author_first_name varchar NOT NULL,
  rating NUMERIC,
  PRIMARY KEY(id),
  CONSTRAINT rating_1_to_5 CHECK (rating is NULL OR rating >= 1 AND rating <= 5),
  CONSTRAINT author_title_unique UNIQUE (author_last_name, title)
);

INSERT INTO "0e995960-7b05-421b-9b4b-de36dc1edcee".books (title, author_last_name, author_first_name)
VALUES 
  ('The Ugly Duckling', 'Anderson', 'Hans Christian'),
  ('The Very Hungry Caterpillar', 'Carle', 'Eric')
;