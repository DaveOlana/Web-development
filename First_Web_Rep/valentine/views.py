import datetime

from django.shortcuts import render

# Create your views here; i.e what is seen on website

def index(request):
    now = datetime.datetime.now()
    return render(request, "valentine/index.html", {
        "valentine": now.month == 2 and now.day == 14
    })
   
