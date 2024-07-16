from sagemaker.predictor import retrieve_default
import re


def bot_response_api(message, endpoint): 
    message = "Assuma o papel de um consultor jurídico com especialidade na área trabalhista brasileira, responda apenas em português de forma clara e sucinta. Não faça nenhuma introdução, apenas responda a pergunta diretamente: " + message

    predictor = retrieve_default(endpoint_name=endpoint)

    payload = {
        "inputs": f"<s>[INST] {message} [/INST]",
        "parameters": {
            "max_new_tokens": 256,
        }
    }
    response = predictor.predict(payload)

    response = str(response[0])

    answer = re.sub(r"{'generated_text': '<s>\[INST\](.*?)\[\/INST\]", "", response)
    answer = answer.replace("}", "").replace("'", "")
    answer = answer.replace('\\n', '\n\n')

    # predictor = retrieve_default(endpoint)
    # payload = {
    #     "inputs": f"<|begin_of_text|><|start_header_id|>{user}<|end_header_id|>\n\n{message}<|eot_id|><|start_header_id|>{chat}<|end_header_id|>\n\n",
    #     "parameters": {
    #         "max_new_tokens": 256,
    #         "top_p": 0.9,
    #         "temperature": 0.6,
    #         "stop": "<|eot_id|>"
    #     }
    # }
    # answer = predictor.predict(payload)

    return(answer)
