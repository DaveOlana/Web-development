#i am about to learn about exceptions in python.

import sys

try:

    x = int(input("What is the value of x: "))
    y = int(input("What is the value of y: "))
except ValueError:
    print("Error: Please put in a value > 0")
    sys.exit(1)

if 0 in (x,y):
    raise ValueError("input values cannot be 0")
else:
    result = x / y
    print(f"{x} / {y} = {result}")

