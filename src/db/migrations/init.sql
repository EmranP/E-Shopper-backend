-- ========================
-- 1. FUNCTIONS
-- ========================

-- Удалим функции, если уже существуют
DROP FUNCTION IF EXISTS public.update_timestamp() CASCADE;
DROP FUNCTION IF EXISTS public.update_search_vector() CASCADE;

-- Функция для авто-обновления updated_at
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

-- Функция для обновления поискового вектора
CREATE OR REPLACE FUNCTION public.update_search_vector()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('russian', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'B') ||
    setweight(to_tsvector('russian', coalesce(NEW.description, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'D');
  RETURN NEW;
END;
$$;

-- ========================
-- 2. TABLES
-- ========================

-- 2.1 users
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  is_activated BOOLEAN DEFAULT false,
  activation_link TEXT,
  role INTEGER NOT NULL DEFAULT 1 CHECK (role IN (0,1,2)),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 2.2 categories
CREATE TABLE IF NOT EXISTS public.categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 2.3 products
CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  category_id INTEGER REFERENCES public.categories(id) ON DELETE SET NULL,
  user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  image_url TEXT,
  search_vector tsvector
);

-- 2.4 tokens
CREATE TABLE IF NOT EXISTS public.tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  refresh_token TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- 2.5 carts
CREATE TABLE IF NOT EXISTS public.carts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 2.6 cart_items
CREATE TABLE IF NOT EXISTS public.cart_items (
  id SERIAL PRIMARY KEY,
  cart_id INTEGER REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 2.7 orders
CREATE TABLE IF NOT EXISTS public.orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
  total_price NUMERIC(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 2.8 order_items
CREATE TABLE IF NOT EXISTS public.order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 2.9 reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- ========================
-- 3. TRIGGERS
-- ========================

-- Обновление search_vector в products
CREATE TRIGGER trigger_update_search_vector
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_search_vector();

-- Обновление updated_at на изменение в каждой таблице
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'users', 'reviews', 'products', 'orders',
    'order_items', 'categories', 'carts', 'cart_items'
  ] LOOP
    EXECUTE format(
      'CREATE OR REPLACE TRIGGER set_timestamp_%1$I
        BEFORE UPDATE ON public.%1$I
        FOR EACH ROW
        EXECUTE FUNCTION public.update_timestamp();',
      tbl
    );
  END LOOP;
END;
$$;
