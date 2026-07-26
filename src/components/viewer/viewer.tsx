import ImageViewer from "~/components/image-viewer";

type ViewerProps = {
  /**
   * Whether the viewer is open.
   */
  open: boolean;
  /**
   * Closes the viewer.
   */
  onClose: () => void;
  /**
   * Bucket the file is in.
   */
  bucket: string;
  /**
   * S3 key path of the file.
   */
  key: string;
  /**
   * All image URLs in the same folder for prev/next navigation.
   */
  images: string[];
  /**
   * Index of the current image in the images array.
   */
  imageIndex: number;
};

/**
 * Determines whether a file is an image based on its extension.
 */
function isImage(key: string): boolean {
  return /\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i.test(key);
}

/**
 * Factory component that renders the correct viewer for a file type.
 */
const Viewer = (props: ViewerProps) => {
  const { open, onClose, key: keyPath, images, imageIndex } = props;

  if (isImage(keyPath)) {
    return (
      <ImageViewer
        open={open}
        onClose={onClose}
        images={images}
        index={imageIndex}
      />
    );
  }

  return null;
};

export default Viewer;
export type { ViewerProps };
