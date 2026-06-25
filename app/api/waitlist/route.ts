export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || typeof email !== 'string') {
    return Response.json({ success: false, error: '请输入邮箱' }, { status: 400 });
  }

  console.log('[灵枢] 等待名单新用户:', email);

  return Response.json({ success: true });
}
