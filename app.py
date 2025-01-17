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
telegram_user_id = "USER_TELEGRAM_ID"  # Replace with dynamic user ID
telegram_api_url = f"https://api.telegram.org/bot{telegram_bot_token}/getChat?chat_id={telegram_user_id}"

# Fetch Telegram user info
response = requests.get(telegram_api_url)

# Check if the request was successful
if response.status_code == 200:
    data = response.json()
    if data['ok']:
        username = data['result']['username']
        user_data = get_user_data(username)
        if user_data is None:
            add_user_data(username)
            user_data = get_user_data(username)

        print(f"User: {username}, Balance: {user_data['balance']}")
    else:
        print(f"Error fetching Telegram username: {data['description']}")
else:
    print(f"Error fetching data from Telegram API. Status code: {response.status_code}")