import random
'''
1 for snake
-1 for water 
0 for gun
'''
computer = random.choice([-1, 0, 1]) #letting the computer choose
youstr = input("Enter your choice: ") #entering users choice
youDict = {"s": 1, "w": -1, "g": 0} #number associated with choice
reverseDict = {1: "Snake", -1: "Water", 0: "Gun"} #converting number into choice

you = youDict[youstr] #here you=1,0,-1

# By now we have 2 numbers (variables), you and computer

print(f"You chose {reverseDict[you]}\nComputer chose {reverseDict[computer]}")

if(computer == you):
    print("Its a draw")

else:
    if(computer ==-1 and you == 1): 
        print("You win!")

    elif(computer ==-1 and you == 0):
        print("You Lose!")

    elif(computer == 1 and you == -1):
        print("You lose!")

    elif(computer ==1 and you == 0):
        print("You Win!")

    elif(computer ==0 and you == -1):
        print("You Win!")

    elif(computer == 0 and you == 1):
        print("You Lose!")

    else:
        print("Something went wrong!")