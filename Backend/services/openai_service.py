import base64
from openai import AsyncOpenAI
from config import OPENAI_API_KEY

# Initialize OpenAI client
openai = AsyncOpenAI(api_key=OPENAI_API_KEY)

# Function to generate thumbnail using OpenAI's DALL-E API
async def generate_thumbnail(prompt: str, style_prompt: str, headshot_url: str) -> bytes:
    """Use the Response API with gpt-images-2 as a built-in image generation tool. 
    Pass the headset URL directly as input_image. 
    Returns or raw PNG bytes."""

    full_prompt= (
        f"{style_prompt} \n\n"
        f"User request: {prompt} \n\n"
        "IMPORTANT: The generated thumbnail MUST prominently feature the person."
        "shown in the provided reference, headshot photo. Keep their likeness accurate"
    )
    
   # Call OpenAI's Response API with gpt-4o and the image generation tool
    response = await openai.responses.create(
            model="gpt-4o",
            input = [
                {
                    "role": "user",
                    "content": [
                        {"type": "input_text", "url": headshot_url},
                        {"type": "text", "text": full_prompt}
                    ]

                }
            ],
            tools=[{
                "type":"image_generation",
                "model":"gpt-images-2",
                "size":"1536x1024",
                "quality":"standard",
                "output_format":"png",
            }],
            )


    for item in response.output:
        if item.type == "image_generation_call" and item.result:
            return base64.b64decode(item.result)
    raise ValueError("No image generated in the response.")

