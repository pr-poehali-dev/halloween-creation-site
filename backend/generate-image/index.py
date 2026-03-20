"""
Генерация Хэллоуин-картинок через Stability AI.
Принимает текстовое описание и стиль, возвращает URL картинки.
"""
import json
import os
import base64
import boto3
import requests
import uuid


def handler(event: dict, context) -> dict:
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    body = json.loads(event.get("body") or "{}")
    prompt = body.get("prompt", "").strip()
    style = body.get("style", "cartoon")

    if not prompt:
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "Описание картинки не может быть пустым"}),
        }

    style_modifiers = {
        "cartoon": "cartoon style, vibrant colors, halloween theme, cute and fun, animated",
        "realistic": "photorealistic, dramatic lighting, halloween atmosphere, cinematic",
        "pixel": "pixel art style, 8-bit, retro game, halloween",
        "fantasy": "fantasy illustration, magical, ethereal, halloween, detailed painting",
    }

    modifier = style_modifiers.get(style, style_modifiers["cartoon"])
    full_prompt = f"halloween scene: {prompt}, {modifier}, pumpkins, spider webs, bats, neon orange and green glow, dark night"

    api_key = os.environ.get("STABILITY_API_KEY", "")

    response = requests.post(
        "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        json={
            "text_prompts": [
                {"text": full_prompt, "weight": 1},
                {"text": "blurry, low quality, watermark, text, nsfw", "weight": -1},
            ],
            "cfg_scale": 7,
            "height": 1024,
            "width": 1024,
            "steps": 30,
            "samples": 1,
        },
        timeout=60,
    )

    if response.status_code != 200:
        return {
            "statusCode": 502,
            "headers": cors_headers,
            "body": json.dumps({"error": "Ошибка генерации. Проверь API ключ."}),
        }

    data = response.json()
    img_b64 = data["artifacts"][0]["base64"]
    img_bytes = base64.b64decode(img_b64)

    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )

    file_key = f"halloween-generated/{uuid.uuid4()}.png"
    s3.put_object(
        Bucket="files",
        Key=file_key,
        Body=img_bytes,
        ContentType="image/png",
    )

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/files/{file_key}"

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"url": cdn_url, "prompt": full_prompt}),
    }
