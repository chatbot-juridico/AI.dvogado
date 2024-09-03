from sagemaker.predictor import retrieve_default
import re


def bot_response_api(message, endpoint, model):
    observations  =  """Você se chama A.Idvogado. Você é um bot especializado em consultoria jurídica trabalhista brasileira.
                        Você não substitui uma consultoria real. Receberá um histórico de conversa onde todas as mensagens são precedidas por um identificador: USER ou BOT. As mensagens enviadas pelo BOT referem-se às suas respostas.
                        Seja simpático e educado. Responda de forma sucinta às perguntas feitas pelo usuário e não aborde assuntos não relacionados. Não gere novas perguntas ou interações semelhantes.
                        Responda em português."""

    predictor = retrieve_default(endpoint_name=endpoint)

    if model == "mistral":
        payload = {
            "inputs": f"<s>[INST] {observations} {message} [/INST]",
            "parameters": {
                "max_new_tokens": 256,
            },
        }
        
    else:
        payload = {
            "inputs": f"<|begin_of_text|>{observations}<|start_header_id|>user<|end_header_id|>{message}<|eot_id|><|start_header_id|>A.Idvogado<|end_header_id|>\n\n",
            "parameters": {
                "max_new_tokens": 256,
                "top_p": 0.9,
                "temperature": 0.6
            }
        }
    response = predictor.predict(payload)
    response = str(response[0])

    if model == "mistral":
        answer = re.sub(r"(.*?)\[\/INST\]", "", response)
        answer = answer.replace("}", "").replace("'", "")
        answer = answer.replace("\\n", "\n\n")
        answer = answer.replace("BOT: ", "")
        answer = answer[:-1]
    else:
        print(message)
        answer = re.sub(r"(.*?)<\|end_header_id\|>", "", response)
        answer = re.sub(r'<\/s>(.*?)$', "", answer)
        answer = answer.replace("\\n\\nUSER: ", "")
        answer = re.sub(r"^.*?(BOT:)", r'\1', answer)
        answer = answer.replace("BOT:", "")
        answer = answer.replace("\\n", "\n\n")

    return answer
