const toast = document.querySelector(".toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    showToast("계좌번호를 복사했어요");
  } catch {
    showToast("계좌번호: 356-0975-2573-23");
  }
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", () => copyText(button.dataset.copy));
});

document.querySelector("#shareButton").addEventListener("click", async () => {
  const shareData = {
    title: "얼음골 사과(홍로) 가격표",
    text: "얼음골 사과(홍로) 가정용·추석 선물용 가격표를 확인해 보세요.",
    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (error) {
      if (error.name !== "AbortError") showToast("공유하지 못했어요. 다시 시도해 주세요.");
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast("링크를 복사했어요. 카카오톡에 붙여넣어 주세요.");
  } catch {
    showToast("주소창의 링크를 복사해 공유해 주세요.");
  }
});
