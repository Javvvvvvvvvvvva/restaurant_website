-- Fix RLS for first-time restaurant creation (no membership row yet).

-- 1) Authenticated users may insert restaurants only when they are the owner.
drop policy if exists restaurants_insert_owner on public.restaurants;

create policy restaurants_insert_owner
  on public.restaurants
  for insert
  to authenticated
  with check (owner_id = auth.uid());

-- 2) Authenticated users may select restaurants they own, are members of, or that are published.
drop policy if exists restaurants_select_member_or_published on public.restaurants;

create policy restaurants_select_member_or_published
  on public.restaurants
  for select
  to authenticated
  using (
    owner_id = auth.uid()
    or is_published = true
    or public.is_restaurant_member(id)
  );

-- 3) Allow initial owner membership row when user owns the restaurant.
create policy restaurant_members_insert_initial_owner
  on public.restaurant_members
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and role = 'owner'
    and exists (
      select 1
      from public.restaurants r
      where r.id = restaurant_id
        and r.owner_id = auth.uid()
    )
  );
