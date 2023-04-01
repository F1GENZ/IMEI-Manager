function Authentication() {
  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get("access_token");
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    window.location.href = "/admin/products";
  } else {
    alert("Bạn không có quyền truy cập nội dung này");
    window.history.back();
  }
}

export default Authentication;
