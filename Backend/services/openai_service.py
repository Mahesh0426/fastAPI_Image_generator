import base64

from openai import AsyncOpenAI

from config import OPENAI_API_KEY


# Initialize OpenAI client
openai = AsyncOpenAI(api_key=OPENAI_API_KEY)


async def generate_thumbnail(
    prompt: str,
    style_prompt: str,
    headshot_url: str,
) -> bytes:
    """Generate a thumbnail image with the OpenAI Responses API and the
    built-in `image_generation` tool.

    The user's headshot is supplied as an `input_image` content item so the
    model can preserve their likeness; the prompt + style instructions are
    supplied as a separate `input_text` content item.

    Returns the raw PNG bytes of the generated image.
    """
    full_prompt = (
        f"{style_prompt}\n\n"
        f"User request: {prompt}\n\n"
        "IMPORTANT: The generated thumbnail MUST prominently feature the "
        "person shown in the provided reference headshot photo. Keep their "
        "likeness accurate."
    )

    response = await openai.responses.create(
        # `gpt-4o` requires OpenAI organization verification. `gpt-4o-mini` is
        # generally accessible without verification and works the same way
        # with the image_generation tool.
        # If you've verified your org and want higher quality, swap this back
        # to "gpt-4o" or "gpt-4.1".
        model="gpt-4o-mini",
        input=[
            {
                "role": "user",
                "content": [
                    # Reference headshot — must be an `input_image` content item
                    # in the Responses API. `image_url` accepts a public HTTPS URL
                    # (or a data: URL). `detail` controls model image-resolution.
                    {
                        "type": "input_image",
                        "image_url": headshot_url,
                        "detail": "auto",
                    },
                    # Prompt text — must be `input_text`, not `text`.
                    {
                        "type": "input_text",
                        "text": full_prompt,
                    },
                ],
            }
        ],
        tools=[
            {
                "type": "image_generation",
                "model": "gpt-image-1",
                "size": "1536x1024",
                "quality": "high",
                "output_format": "png",
            }
        ],
    )

    # The image is returned as a base64-encoded PNG on an
    # `image_generation_call` output item.
    for item in response.output:
        if item.type == "image_generation_call" and item.result:
            return base64.b64decode(item.result)

    raise ValueError("No image generated in the response.")
