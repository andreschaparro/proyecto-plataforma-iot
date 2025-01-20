// Hace un put a una url y envía el body en formato json
export const put = async (url, body) => {
    try {
        const response = await fetch(
            url,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }
        )

        // Muestra el error en la consola
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message)
        }

        // Muestra el mensaje de éxito en la consola
        const result = await response.json()
        console.log(result.message)
    } catch (error) {
        console.error(`Error al hacer un put en la url ${url}: ${error.message}`)
    }
}