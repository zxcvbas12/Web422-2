function showModal(title, content) {
  const modalTitle = document.getElementById("exampleModalLabel");
  const modalBody = document.querySelector(".modal-body");

  modalTitle.textContent = title;
  modalBody.innerHTML = content;

  // 모달 창 표시
  const detailsModal = new bootstrap.Modal(
    document.getElementById("detailsModal")
  );
  detailsModal.show();
}
