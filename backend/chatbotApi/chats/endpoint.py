from sagemaker.predictor import retrieve_default
import re


def bot_response_api(message, endpoint):
    message = (
        "Assuma o papel de um consultor jurídico especializado na área trabalhista brasileira. Responda apenas questões relacionadas ao direito trabalhista brasileiro, de forma clara e sucinta, em português. Não discorra sobre assuntos não relacionados. Não faça nenhuma introdução, apenas responda a pergunta diretamente: "
        + str(message)
    )

    predictor = retrieve_default(endpoint_name=endpoint)

    payload = {
        "inputs": f"<s>[INST] {message} [/INST]",
        "parameters": {
            "max_new_tokens": 256,
        },
    }
    response = predictor.predict(payload)

    response = str(response[0])

    answer = re.sub(r"(.*?)\[\/INST\]", "", response)
    answer = answer.replace("}", "").replace("'", "")
    answer = answer.replace("\\n", "\n\n")

    return answer
