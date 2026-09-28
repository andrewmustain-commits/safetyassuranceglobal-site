type PagesContext = {
  request: Request;
  next(): Promise<Response>;
};

export const onRequest = async (context: PagesContext) => {
  const url = new URL(context.request.url);

  if (url.hostname.toLowerCase() === 'www.safetyassuranceglobal.com') {
    url.hostname = 'safetyassuranceglobal.com';
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
};
