import requests
from faker import Faker
import json

# Initialize Faker to generate random data
fake = Faker()

# Function to create random user data
def generate_user_data():
    return {
        "username": fake.user_name(),
        "email": fake.email(),
        "password": "12345678",  # You can also randomize this if needed
        "roles": ["admin", "moderator", "user"]
    }

# Main function to send requests
def main():
    # Get the number of users to create from user input
    num_users = int(input("How many users do you want to add? "))

    for _ in range(num_users):
        user_data = generate_user_data()

        response = requests.post("http://localhost:8080/api/auth/signup", json=user_data)

        if response.status_code == 200:  # Assuming 201 is the success code for user creation
            print(f"User created: {user_data['username']}")
        else:
            print(f"Failed to create user: {user_data['username']} - Status Code: {response.status_code}")

if __name__ == "__main__":
    main()
