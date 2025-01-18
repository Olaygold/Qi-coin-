import firebase_admin
from firebase_admin import credentials, firestore
import requests

# Initialize Firebase
cred = credentials.Certificate('drive-120a7-firebase-adminsdk-q89z7-8810f0783e.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

# Function to fetch user data from Firebase
def get_user_data(username):
    user_ref = db.collection('users').document(username)
    user_doc = user_ref.get()
    if user_doc.exists:
        return user_doc.to_dict()
    else:
        return None

# Function to add user data to Firebase
def add_user_data(username):
    user_ref = db.collection('users').document(username)
    user_ref.set({
        'username': username,
        'balance': 0,
    })

# Telegram Bot API URL
telegram_bot_token = "7739360079:AAEa9TTmHfdYWvXR7OxnrcF6hAsBiQ7itOw"

# Fetch latest updates (messages) from the bot to get user info
telegram_api_url = f"https://api.telegram.org/bot{telegram_bot_token}/getUpdates"

response = requests.get(telegram_api_url)

# Check if the request was successful
if response.status_code == 200:
    data = response.json()
    if data['ok'] and len(data['result']) > 0:
        # Get the latest message from the bot
        message = data['result'][-1]  # Assuming the latest message
        user_id = message['message']['from']['id']
        username = message['message']['from'].get('username', 'Unknown')  # Use 'Unknown' if no username is available

        # Check if user exists in Firebase
        user_data = get_user_data(username)
        if user_data is None:
            # If the user doesn't exist, add them to Firebase
            add_user_data(username)
            user_data = get_user_data(username)

        print(f"User: {username}, Balance: {user_data['balance']}")
    else:
        print("No new messages or data from Telegram API.")
else:
    print(f"Error fetching data from Telegram API. Status code: {response.status_code}")
