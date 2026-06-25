-- 1. 事件表（核心）
create table events (
 id bigint primary key generated always as identity,
 session_id text not null,
 event_name text not null,
 metadata jsonb default '{}'::jsonb,
 created_at timestamptz default now()
);

-- 2. 分享表
create table shares (
 id bigint primary key generated always as identity,
 session_id text not null,
 hook_id text,
 recovery_type text,
 platform text,
 created_at timestamptz default now()
);

-- 3. 索引
create index idx_events_session on events(session_id);
create index idx_events_name on events(event_name);
create index idx_events_created on events(created_at desc);
create index idx_shares_session on shares(session_id);
create index idx_shares_type on shares(recovery_type);
