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
const isKakaoInAppBrowser = /KAKAOTALK/i.test(navigator.userAgent);

if (isKakaoInAppBrowser) {
  shareButton.lastChild.textContent = " 링크 복사해서 공유하기";
}

async function copyShareLink() {
  const copied = await writeToClipboard(window.location.href);
  showToast(
    copied
      ? "링크를 복사했어요. 카카오톡 채팅방에 붙여넣어 주세요."
      : "주소창의 링크를 복사해 카카오톡에 붙여넣어 주세요.",
  );
}

shareButton.addEventListener("click", async () => {
  const shareData = {
    title: "얼음골 사과(홍로) 가격표",
    text: "얼음골 사과(홍로) 가정용·추석 선물용 가격표를 확인해 보세요.",
    url: window.location.href,
  };

  const canUseNativeShare =
    !isKakaoInAppBrowser &&
    typeof navigator.share === "function" &&
    (typeof navigator.canShare !== "function" || navigator.canShare(shareData));

  if (canUseNativeShare) {
    try {
      await navigator.share(shareData);
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  await copyShareLink();
});
