/* =========================================
   PDFMASTER - REUSABLE FILE UPLOAD SYSTEM
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const uploadBox = document.getElementById("uploadBox");
    const fileInput = document.getElementById("fileInput");
    const chooseFilesButton = document.getElementById("chooseFilesButton");

    if (!uploadBox || !fileInput) {
        return;
    }

    let selectedFiles = [];

    /* =========================================
       OPEN FILE PICKER
    ========================================= */

    chooseFilesButton?.addEventListener("click", (event) => {

        event.stopPropagation();

        fileInput.click();

    });


    /* =========================================
       CLICK UPLOAD BOX
    ========================================= */

    uploadBox.addEventListener("click", (event) => {

        if (event.target === chooseFilesButton) {
            return;
        }

        fileInput.click();

    });


    /* =========================================
       KEYBOARD ACCESS
    ========================================= */

    uploadBox.addEventListener("keydown", (event) => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            fileInput.click();

        }

    });


    /* =========================================
       FILE INPUT
    ========================================= */

    fileInput.addEventListener("change", (event) => {

        const files = Array.from(event.target.files);

        addFiles(files);

        fileInput.value = "";

    });


    /* =========================================
       DRAG OVER
    ========================================= */

    uploadBox.addEventListener("dragover", (event) => {

        event.preventDefault();

        uploadBox.classList.add("drag-over");

    });


    /* =========================================
       DRAG LEAVE
    ========================================= */

    uploadBox.addEventListener("dragleave", () => {

        uploadBox.classList.remove("drag-over");

    });


    /* =========================================
       DROP
    ========================================= */

    uploadBox.addEventListener("drop", (event) => {

        event.preventDefault();

        uploadBox.classList.remove("drag-over");

        const files = Array.from(event.dataTransfer.files);

        addFiles(files);

    });


    /* =========================================
       ADD FILES
    ========================================= */

    function addFiles(files) {

        if (!files.length) {
            return;
        }

        const validFiles = [];

        files.forEach((file) => {

            const validation = validateFile(file);

            if (!validation.valid) {

                showUploadMessage(
                    validation.message,
                    "error"
                );

                return;
            }

            validFiles.push(file);

        });


        selectedFiles = [
            ...selectedFiles,
            ...validFiles
        ];

        updateUploadDisplay();

    }


    /* =========================================
       FILE VALIDATION
    ========================================= */

    function validateFile(file) {

        const maxSize = 50 * 1024 * 1024;

        if (file.size > maxSize) {

            return {
                valid: false,
                message:
                    `${file.name} is larger than the 50 MB limit.`
            };

        }

        if (file.size === 0) {

            return {
                valid: false,
                message:
                    `${file.name} appears to be empty.`
            };

        }

        return {
            valid: true
        };

    }


    /* =========================================
       DISPLAY UPLOADED FILES
    ========================================= */

    function updateUploadDisplay() {

        let fileList =
            document.getElementById("uploadFileList");


        if (!fileList) {

            fileList =
                document.createElement("div");

            fileList.id =
                "uploadFileList";

            fileList.className =
                "upload-file-list";

            uploadBox.after(fileList);

        }


        fileList.innerHTML = "";


        selectedFiles.forEach((file, index) => {

            const fileItem =
                document.createElement("div");

            fileItem.className =
                "upload-file-item";


            const fileInfo =
                document.createElement("div");

            fileInfo.className =
                "upload-file-info";


            const fileIcon =
                document.createElement("div");

            fileIcon.className =
                "upload-file-icon";

            fileIcon.textContent =
                getFileIcon(file);


            const fileDetails =
                document.createElement("div");

            fileDetails.className =
                "upload-file-details";


            const fileName =
                document.createElement("strong");

            fileName.textContent =
                file.name;


            const fileSize =
                document.createElement("span");

            fileSize.textContent =
                formatFileSize(file.size);


            fileDetails.appendChild(fileName);
            fileDetails.appendChild(fileSize);

            fileInfo.appendChild(fileIcon);
            fileInfo.appendChild(fileDetails);


            const removeButton =
                document.createElement("button");

            removeButton.type =
                "button";

            removeButton.className =
                "remove-file-button";

            removeButton.textContent =
                "×";

            removeButton.setAttribute(
                "aria-label",
                `Remove ${file.name}`
            );


            removeButton.addEventListener(
                "click",
                () => {

                    removeFile(index);

                }
            );


            fileItem.appendChild(fileInfo);
            fileItem.appendChild(removeButton);

            fileList.appendChild(fileItem);

        });


        if (selectedFiles.length > 0) {

            showUploadMessage(
                `${selectedFiles.length} file${
                    selectedFiles.length === 1
                        ? ""
                        : "s"
                } selected.`,
                "success"
            );

        }

    }


    /* =========================================
       REMOVE FILE
    ========================================= */

    function removeFile(index) {

        selectedFiles.splice(index, 1);

        updateUploadDisplay();

        if (selectedFiles.length === 0) {

            showUploadMessage(
                "No files selected.",
                "info"
            );

        }

    }


    /* =========================================
       FILE ICON
    ========================================= */

    function getFileIcon(file) {

        const type =
            file.type.toLowerCase();

        if (type.includes("pdf")) {
            return "PDF";
        }

        if (type.includes("image")) {
            return "IMG";
        }

        if (
            type.includes("word") ||
            file.name.endsWith(".doc") ||
            file.name.endsWith(".docx")
        ) {
            return "DOC";
        }

        if (
            type.includes("excel") ||
            file.name.endsWith(".xls") ||
            file.name.endsWith(".xlsx")
        ) {
            return "XLS";
        }

        if (
            type.includes("powerpoint") ||
            file.name.endsWith(".ppt") ||
            file.name.endsWith(".pptx")
        ) {
            return "PPT";
        }

        return "FILE";

    }


    /* =========================================
       FORMAT FILE SIZE
    ========================================= */

    function formatFileSize(bytes) {

        if (bytes === 0) {
            return "0 Bytes";
        }

        const units = [
            "Bytes",
            "KB",
            "MB",
            "GB"
        ];

        const index =
            Math.floor(
                Math.log(bytes) /
                Math.log(1024)
            );

        const size =
            bytes /
            Math.pow(1024, index);

        return `${size.toFixed(
            index === 0 ? 0 : 2
        )} ${units[index]}`;

    }


    /* =========================================
       UPLOAD MESSAGE
    ========================================= */

    function showUploadMessage(
        message,
        type = "info"
    ) {

        let messageElement =
            document.getElementById(
                "uploadMessage"
            );


        if (!messageElement) {

            messageElement =
                document.createElement("div");

            messageElement.id =
                "uploadMessage";

            messageElement.className =
                "upload-message";

            uploadBox.after(messageElement);

        }


        messageElement.textContent =
            message;

        messageElement.className =
            `upload-message ${type}`;

    }


    /* =========================================
       PUBLIC API
    ========================================= */

    window.PDFMasterUpload = {

        getFiles: () => [
            ...selectedFiles
        ],

        clearFiles: () => {

            selectedFiles = [];

            updateUploadDisplay();

            showUploadMessage(
                "No files selected.",
                "info"
            );

        },

        addFiles

    };

});