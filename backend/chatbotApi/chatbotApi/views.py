from django.http import JsonResponse

def test_view(request):
    data = {'message': 'Esta eh uma resposta de teste do backend!'}
    return JsonResponse(data)