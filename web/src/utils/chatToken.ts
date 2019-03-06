export function getChatToken() {
  const chatToken = window.location.pathname.split('/')[1];

  if (!chatToken || !/^G?[a-z0-9]+$/.test(chatToken)) {
    return;
  }

  return chatToken;
}
