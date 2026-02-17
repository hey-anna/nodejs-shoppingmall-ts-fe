import { useEffect } from "react";
import { Button } from "react-bootstrap";

const CLOUDNAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOADPRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

type Props = {
  onUpload: (url: string) => void;
  // uploadImage: (url: string) => void;
};

export default function CloudinaryUploadWidget({ onUpload }: Props) {
  useEffect(() => {
    if (!window.cloudinary) return;

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDNAME,
        uploadPreset: UPLOADPRESET,
      },
      (error: any, result: any) => {
        if (!error && result?.event === "success") {
          const url = result.info.secure_url;
          onUpload(url); // 부모로 전달
        }
      },
    );

    const btn = document.getElementById("upload_widget");

    btn?.addEventListener("click", () => widget.open());

    return () => btn?.removeEventListener("click", () => widget.open());
  }, [onUpload]);

  return (
    <Button id="upload_widget" size="sm" className="ms-2">
      Upload Image +
    </Button>
  );
}
