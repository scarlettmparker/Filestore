import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogBody, DialogHeader, DialogTitle, Button } from "@sun/components";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./image-viewer.module.css";

type ImageViewerProps = {
  /**
   * Whether the dialog is open.
   */
  open: boolean;
  /**
   * Closes the dialog.
   */
  onClose: () => void;
  /**
   * All image URLs in the folder for prev/next navigation.
   */
  images: string[];
  /**
   * Index of the current image in the images array.
   */
  index: number;
};

/**
 * Displays an image in a dialog with prev/next navigation across sibling
 * images in the same folder.
 */
const ImageViewer = (props: ImageViewerProps) => {
  const { open, onClose, images, index } = props;
  const { t } = useTranslation("bucket");
  const [currentIndex, setCurrentIndex] = useState(index);

  useEffect(() => {
    setCurrentIndex(index);
  }, [index]);

  /**
   * Moves to the previous image in the images array.
   */
  const handlePrev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  }, [images.length]);

  /**
   * Moves to the next image in the images array.
   */
  const handleNext = useCallback(() => {
    setCurrentIndex((i) => (i < images.length - 1 ? i + 1 : 0));
  }, [images.length]);

  return (
    <Dialog open={open} onOpenChange={(o: boolean) => !o && onClose()}>
      <DialogHeader>
        <DialogTitle>{t("viewer.image")}</DialogTitle>
      </DialogHeader>
      <DialogBody className={styles.image_body}>
        {images.length > 1 && (
          <Button
            variant="secondary"
            onClick={handlePrev}
            title={t("viewer.previous")}
            aria-label={t("viewer.previous")}
          >
            <ChevronLeft width={20} height={20} />
          </Button>
        )}
        <div className={styles.image_wrapper}>
          <img src={images[currentIndex]} className={styles.image} alt="" />
        </div>
        {images.length > 1 && (
          <Button
            variant="secondary"
            onClick={handleNext}
            title={t("viewer.next")}
            aria-label={t("viewer.next")}
          >
            <ChevronRight width={20} height={20} />
          </Button>
        )}
      </DialogBody>
    </Dialog>
  );
};

export default ImageViewer;
