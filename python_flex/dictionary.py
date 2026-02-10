#create the students dictionary

students = [
    { "name": "Ben Tenison", "class": "Grade 12", "gender": "Male"}
    { "name": "Dora", "class": "Grade 11", "gender": "Female"}
    { "name": "John", "class": "Grade 10", "gender": "Male"}
]

#create a function that provides only names using lambda

#def f(student):
   # return student ["name"] //erased, lambda provides efficiency

#students.sort(key=f) // erased, lambda povides efficiency

#provide sorting criteria and sort the students

students.sort(key=lambda student: student["name"])

print(students)

