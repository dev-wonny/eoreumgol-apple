const toast = document.querySelector(".toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

async function writeToClipboard(value) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      textarea.remove();
    }
  }
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const copied = await writeToClipboard(button.dataset.copy);
    showToast(copied ? "계좌번호를 복사했어요" : "계좌번호: 356-0975-2573-23");
  });
});

const orderMessage = `[얼음골 사과 주문]
주문자 성함:
집주소:
받는 사람 핸드폰 번호:
주문하고자 하는 것: 홍로사과 5키로 20과 40,000원 2박스`;

document.querySelector("#copyOrderButton").addEventListener("click", async () => {
  const copied = await writeToClipboard(orderMessage);
  showToast(copied ? "주문 양식을 복사했어요" : "주문 양식을 복사하지 못했어요");
});

const smsButton = document.querySelector("#smsButton");
const smsSeparator = /iPhone|iPad|iPod/i.test(navigator.userAgent) ? "&" : "?";
smsButton.href = `sms:01050930672${smsSeparator}body=${encodeURIComponent(orderMessage)}`;

const shareButton = document.querySelector("#shareButton");

async function copyShareLink() {
  const shareUrl = new URL(window.location.href);
  shareUrl.searchParams.set("v", "20260915");
  const copied = await writeToClipboard(shareUrl.href);
  showToast(
    copied
      ? "공유 URL을 복사했어요"
      : "주소창의 URL을 복사해 주세요.",
  );
}

shareButton.addEventListener("click", async () => {
  await copyShareLink();
});
