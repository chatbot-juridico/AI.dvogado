from sagemaker.predictor import retrieve_default
import re

endpoint_name='jumpstart-mistral-default'
inference_component_name='huggingface-llm-mistral-7b-instruct-20240625-142005'

def bot_response_api(message): 
    message = "Assumindo que você é um advogado trabalhista brasileiro, responda apenas em português de forma clara e sucinta. "+message
    
    # Use the session to retrieve the default SageMaker endpoint
    predictor = retrieve_default(endpoint_name=endpoint_name, 
                                inference_component_name=inference_component_name)

    payload = {
        "inputs": f"<s>[INST] {message} [/INST]",
        "parameters": {
            "max_new_tokens": 256,
            "do_sample": True
        }
    }
    response = predictor.predict(payload)

    response = str(response[0])

    answer = re.sub(r"{'generated_text': '<s>\[INST\](.*?)\[\/INST\] ", "", response)
    answer = answer.replace("}", "").replace("'", "")

    return(answer)