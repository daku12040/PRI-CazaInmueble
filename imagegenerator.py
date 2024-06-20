import requests

# Definir la descripción de texto para generar una imagen
texto_descripcion = "Pintura realistica estilizada de reyes cayendo en el pecado de Baal"

# URL de la API de DALL-E
url_api = "https://api.openai.com/v1/davinci/generate"

# Tu clave de API de OpenAI
tu_api_key = "TU_CLAVE_DE_API_AQUI"

# Encabezados de la solicitud HTTP
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {tu_api_key}"
}

# Cuerpo de la solicitud HTTP
body = {
    "prompt": texto_descripcion,
    "max_tokens": 50
}

# Enviar la solicitud HTTP a la API de DALL-E
response = requests.post(url_api, json=body, headers=headers)

# Verificar si la solicitud fue exitosa
if response.status_code == 200:
    # Obtener la imagen generada de la respuesta
    imagen_generada = response.json()["choices"][0]["text"]
    print(imagen_generada)
else:
    print("Error al realizar la solicitud:", response.text)
