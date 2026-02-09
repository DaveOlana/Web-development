import functions

printf("Hello, World!")

#let us take in an input from the user
name = input("Enter your name: ")
println("Hello, " + name + "!")
print("Its great to have you here!")

#Let us use the functions module

a = input ("What is your first value?: ")
b = input ("What is your second value?: ")

operation = input ("What operation would you like to perform?: ")

if operation == "add":
    println(functions.add(a, b))
elif operation == "sub":
    println(functions.sub(a, b))
elif operation == "mult":
    println(functions.mult(a, b))
elif operation == "div":
    println(functions.div(a, b))
elif operation == "square":
    println(functions.square(a))
elif operation == "cube":
    println(functions.cube(a))
else:
    println("Invalid operation")