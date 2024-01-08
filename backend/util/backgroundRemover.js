const axios = require('axios');
const FormData = require('form-data');

async function removeBackgroundFromImage(imageUrl) {
  const formData = new FormData();
  formData.append('size', 'auto');
  formData.append('image_url', imageUrl);

  try {
    const response = await axios({
      method: 'post',
      url: 'https://api.remove.bg/v1.0/removebg',
      data: formData,
      responseType: 'arraybuffer',
      headers: {
        ...formData.getHeaders(),
        'X-Api-Key': process.env.REMOVE_BG_API_KEY,
      },
    });

    if (response.status !== 200) {
      console.error('Error:', response.status, response.statusText);
      return null;
    }

    // Convertir la imagen a Base64
    const imageBase64 = Buffer.from(response.data, 'binary').toString('base64');
    return `data:image/png;base64,${imageBase64}`;

  } catch (error) {
    console.error('Request failed:', error);
    return null;
  }
}

module.exports = removeBackgroundFromImage;
