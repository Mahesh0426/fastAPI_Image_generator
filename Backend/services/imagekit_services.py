from imagekitio import ImageKit
from config import IMAGEKIT_PRIVATE_KEY


# Initialize ImageKit client (imagekitio v5 SDK).
imagekit = ImageKit(
    private_key=IMAGEKIT_PRIVATE_KEY,
)


def upload_file(
    file_bytes: bytes,
    file_name: str,
    folder: str,
    content_type: str = "image/png",
) -> str:
    """Upload a file to ImageKit and return the CDN URL of the uploaded file.

    NOTE: imagekitio v5's `file` argument either accepts raw bytes/IO/path or a
    tuple of (filename, content, content_type). Passing the file as raw bytes
    here and supplying `file_name` separately is the simplest and most reliable
    shape — and avoids a httpx multipart-encoding bug that triggers when the
    tuple shape is wrong.
    """
    # `content_type` is currently informational; the SDK derives the
    # multipart content-type from `file_name` automatically.
    _ = content_type

    result = imagekit.files.upload(
        file=file_bytes,
        file_name=file_name,
        folder=folder,
        is_private_file=False,
        use_unique_file_name=True,
    )
    return result.url


def get_variants(base_url: str) -> dict:
    """Return URLs for the three thumbnail aspect-ratio variants using
    ImageKit transformations."""
    return {
        "youtube": f"{base_url}?tr=w-1280,h-720,c-maintain_ratio,fo-auto",
        "shorts": f"{base_url}?tr=w-1080,h-1920,c-maintain_ratio,fo-auto",
        "square": f"{base_url}?tr=w-1080,h-1080,c-maintain_ratio,fo-auto",
    }
