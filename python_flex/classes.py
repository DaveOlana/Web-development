#We are going to be learning classes here now.ArithmeticError

class Calculate:
    def __init__(self, no1, no2):
        self.a = no1
        self.b = no2

p = Calculate(5, 4)
print(p.no1 + p.no2)
print(p.no1 - p.no2)
print(p.no1 * p.no2)
print(p.no1 / p.no2)
print(p.no1 *p.no1 * p.no1)