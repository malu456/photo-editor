import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';
import React, { useEffect, useState } from 'react';

const ImageCropper = () => {
    const [cropper, setCropper] = useState(null);
    const [fileName, setFileName] = useState("");
    const [acceptedFormats, setAcceptedFormats] = useState(["image/jpeg"]);

    useEffect(() => {
        const fileInput = document.getElementById("file");
        const image = document.getElementById("image");
        const downloadButton = document.getElementById("download");
        const aspectRatioButtons = document.querySelectorAll(".aspect-ratio-button");
        const previewButton = document.getElementById("preview");
        const previewImage = document.getElementById("preview-image");
        const options = document.querySelector(".options");
        const widthInput = document.getElementById("width-input");
        const heightInput = document.getElementById("height-input");

        const aspectRatioClickHandler = (button) => {
            if (button.innerText === "Free") {
                cropper.setAspectRatio(NaN);
            } else {
                let [aspectWidth, aspectHeight] = button.innerText.split(":").map(Number);
                cropper.setAspectRatio(aspectWidth / aspectHeight);
            }
        };

        const heightInputChangeHandler = () => {
            const { height } = cropper.getImageData();
            if (parseInt(heightInput.value) > Math.round(height)) {
                heightInput.value = Math.round(height);
            }
            let newHeight = parseInt(heightInput.value);
            cropper.setCropBoxData({ height: newHeight });
        };

        const widthInputChangeHandler = () => {
            const { width } = cropper.getImageData();
            if (parseInt(widthInput.value) > Math.round(width)) {
                widthInput.value = Math.round(width);
            }
            let newWidth = parseInt(widthInput.value);
            cropper.setCropBoxData({ width: newWidth });
        };

        const previewButtonClickHandler = (e) => {
            e.preventDefault();
            downloadButton.classList.remove("hide");
            let imgSrc = cropper.getCroppedCanvas({}).toDataURL();
            previewImage.src = imgSrc;
            previewImage.style.maxWidth = "100%";
            let editedFileName = `${fileName}_Edited3.${fileInput.files[0].name.split('.').pop()}`;
            downloadButton.setAttribute('download', editedFileName);
            downloadButton.href = imgSrc;
        };

        const fileInputChangeHandler = () => {
            const file = fileInput.files[0];
        
            // Check if there is a file selected
            if (!file) {
                return;
            }
        
            // Get the file extension
            const fileExtension = file.name.split(".").pop().toLowerCase();
        
            // Check if the file extension matches one of the accepted formats
            const validFormats = getAcceptedFormats();
            const isValidFormat = validFormats.some(type => {
                // Check both MIME type and extensions
                return file.type === type || fileExtension === type.split('/')[1];
            });
        
            if (!isValidFormat) {
                showFileTypePrompt();
                fileInput.value = ""; // Clear the file input
                return;
            }
        
            const reader = new FileReader();
        
            reader.onload = (e) => {
                image.src = e.target.result;
                if (cropper) {
                    cropper.destroy();
                }
                setCropper(new Cropper(image, {
                    aspectRatio: NaN,
                    viewMode: 1,
                    crop(event) {
                        // Optional: Do something when cropping
                    },
                }));
                options.classList.remove("hide");
                previewButton.classList.remove("hide");
                document.querySelector(".preview-container").classList.remove("hide");
            };
        
            reader.readAsDataURL(file);
            setFileName(file.name.split(".")[0]);
        };
        

        const getAcceptedFormats = () => {
            const format = document.querySelector('input[name="file-format"]:checked').value;
            if (format === "jpg") {
                return ["image/jpeg"];
            } else if (format === "png") {
                return ["image/png"];
            }
            return [];
        };

        const showFileTypePrompt = () => {
            const promptElement = document.createElement("div");
            promptElement.textContent = "Please upload an image file of the chosen format.";
            promptElement.classList.add("file-type-prompt");
            document.body.appendChild(promptElement);
            setTimeout(() => {
                promptElement.remove();
            }, 3000);
        };

        aspectRatioButtons.forEach((button) => {
            button.addEventListener("click", () => aspectRatioClickHandler(button));
        });

        heightInput.addEventListener("input", heightInputChangeHandler);
        widthInput.addEventListener("input", widthInputChangeHandler);
        previewButton.addEventListener("click", previewButtonClickHandler);
        fileInput.addEventListener("change", fileInputChangeHandler);

        return () => {
            aspectRatioButtons.forEach((button) => {
                button.removeEventListener("click", () => aspectRatioClickHandler(button));
            });
            heightInput.removeEventListener("input", heightInputChangeHandler);
            widthInput.removeEventListener("input", widthInputChangeHandler);
            previewButton.removeEventListener("click", previewButtonClickHandler);
            fileInput.removeEventListener("change", fileInputChangeHandler);
        };
    }, [cropper, fileName, acceptedFormats]);

    const formatChangeHandler = (format) => {
        setAcceptedFormats(format === "jpg" ? ["image/jpeg", "image/jpg"] : ["image/png"]);
    };

    return (
        <div className="main">
            <div className="wrapper">
                <h1>Image Cropper</h1>
                <div className="file-format">
                    <input type="radio" id="jpg" name="file-format" value="jpg" defaultChecked onChange={() => formatChangeHandler("jpg")} />
                    <label htmlFor="jpg">JPG</label>
                    <input type="radio" id="png" name="file-format" value="png" onChange={() => formatChangeHandler("png")} />
                    <label htmlFor="png">PNG</label>
                </div>
                <br />
                <label htmlFor="file" style={{ fontSize: "19px", fontWeight: "bold", color: "#22044c" }}>Upload:</label>
                <input type="file" id="file" accept={acceptedFormats.join(",")} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer", backgroundColor: "#764ba2", color: "white", border: "none", borderRadius: "4px", transition: "background-color 0.3s ease" }} />
                <div className="container">
                    <div className="image-container">
                        <img id="image" alt="" />
                    </div>
                </div>
                <div className="options hide">
                    <input type="number" id="height-input" placeholder="Enter Height" max="780" />
                    <input type="number" id="width-input" placeholder="Enter Width" max="780" />
                    <br />
                    <button className="aspect-ratio-button">16:9</button>
                    <button className="aspect-ratio-button">4:3</button>
                    <button className="aspect-ratio-button">1:1</button>
                    <button className="aspect-ratio-button">2:3</button>
                    <button className="aspect-ratio-button">Free</button>
                </div>
                <div className="btns">
                    <button id="preview" className="hide">Preview Cropped Image</button><br /><br />
                    <div className="preview-container hide">
                        <img id="preview-image" alt='' />
                    </div><br />
                    <div className="button">
                        <a href="" id="download" className="hide">Download</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;
