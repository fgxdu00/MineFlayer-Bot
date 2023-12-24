import socket
import customtkinter as ctk
from PIL import Image
import threading
import json
from tkinter import messagebox
import multiprocessing

class ChatApp:
    def __init__(self, root):
        self.root = root
        self.root.title("CustomTkinter Chat App")

        self.root.wm_minsize(300, 250)

        self.message_frame = ctk.CTkFrame(self.root)
        self.message_frame.pack(fill=ctk.BOTH, expand=True)

        self.message_text = ctk.CTkTextbox(self.message_frame, wrap=ctk.WORD, font=ctk.CTkFont(family="Arial", size=12, weight="bold"))
        self.message_text.pack(fill=ctk.BOTH, expand=True)

        self.input_frame = ctk.CTkFrame(self.root)
        self.input_frame.pack(fill=ctk.X)

        self.input_entry = ctk.CTkEntry(self.input_frame)
        self.input_entry.pack(side=ctk.LEFT, fill=ctk.X, expand=True, padx=1)

        self.send_button = ctk.CTkButton(self.input_frame, text="Send", width=10, height=30, command=self.send_message)
        self.send_button.pack(side=ctk.RIGHT, padx=1)


        self.create_custom_button("connect", self.handle_button_1)
        self.create_custom_button("hub", self.handle_button_2)
        self.create_custom_button("playerList", self.handle_button_3)
        self.create_custom_button("Button 4", self.handle_button_4)
        self.create_custom_button("Button 5", self.handle_button_5)

        self.message_history = []
        self.current_message_index = -1

        self.input_entry.bind('<Return>', lambda event: self.send_message() if self.input_entry.get() else None)
        self.input_entry.bind('<Up>', self.retrieve_previous_message)
        self.input_entry.bind('<Down>', self.retrieve_next_message)

        self.socket_thread = threading.Thread(target=self.receive_messages)
        self.socket_thread.start()

    def create_custom_button(self, text, command):
        button = ctk.CTkButton(self.root, text=text, width=10, height=30, command=command)
        button.pack(side=ctk.LEFT, padx=1, pady=1)

    def handle_button_1(self):
        message = 'connect'
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.connect(('localhost', 3010))
                s.sendall(message.encode('utf-8'))
            except (socket.error, BrokenPipeError):
                print("Connection to the server lost. Exiting.")
                exit()

    def handle_button_2(self):
        message = '/hub'
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.connect(('localhost', 3010))
                s.sendall(message.encode('utf-8'))
            except (socket.error, BrokenPipeError):
                print("Connection to the server lost. Exiting.")
                exit()

    def handle_button_3(self):
        threading.Thread(target=self.handle_player_list_button).start()

    def handle_player_list_button(self):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.connect(('localhost', 3010))
                s.sendall("playerList".encode('utf-8'))
                data = s.recv(1024).decode('utf-8')
                if data.startswith('playerList:'):
                    try:
                        if data == "playerList: ":
                            pass
                        else:
                            self.message_text.insert(ctk.END, f"{data}\n")
                    except json.JSONDecodeError as e:
                        print("Error decoding JSON:", e)
                else:
                    messagebox.showinfo("Player List", "No players on the server.")
            except (socket.error, BrokenPipeError):
                print("Connection to the server lost. Exiting.")
                exit()

    def get_player_list_and_display(self):
        message = 'playerList'
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.connect(('localhost', 3010))
                s.sendall(message.encode('utf-8'))
                data = s.recv(1024).decode('utf-8')
                if data.startswith('playerList:'):
                    player_list = json.loads(data[len('playerList:'):])
                    self.show_player_list_notification(player_list)
                else:
                    messagebox.showinfo("Player List", "No players on the server.")
            except (socket.error, BrokenPipeError):
                print("Connection to the server lost. Exiting.")
                exit()

    def show_player_list_notification(self, player_list):
        players_str = "\n".join(player_list)
        message = f"Player List:\n{players_str}\n"
        self.message_text.insert(ctk.END, message)
        self.message_text.yview_moveto(1.0)
    def handle_button_4(self):
        # Handle the functionality for Button 4
        pass

    def handle_button_5(self):
        # Handle the functionality for Button 5
        pass

    def send_message(self):
        message = self.input_entry.get()
        if message:
            self.input_entry.delete(0, ctk.END)
            self.message_text.yview_moveto(1.0)

        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.connect(('localhost', 3010))
                s.sendall(message.encode('utf-8'))
            except (socket.error, BrokenPipeError):
                print("Connection to the server lost. Exiting.")
                exit()
        self.message_history.append(message)
        self.current_message_index = -1


    def receive_messages(self):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.connect(('localhost', 3011))
                while True:
                    data = s.recv(1024).decode('utf-8')
                    if not data:
                        break
                    if data.startswith('playerList:'):
                        player_list = json.loads(data[len('playerList:'):])
                        print("Player List:", player_list)
                    else:
                        self.message_text.insert(ctk.END, f"{data}\n")
                        self.message_text.yview_moveto(1.0)
            except (socket.error, BrokenPipeError):
                print("Connection to the server lost. Exiting.")
            exit()

    def retrieve_previous_message(self, event):
        if self.message_history:
            if self.current_message_index == -1:
                self.current_message = self.input_entry.get()
            self.current_message_index = max(0, self.current_message_index + 1)
            self.input_entry.delete(0, ctk.END)
            self.input_entry.insert(0, self.message_history[self.current_message_index])

    def retrieve_next_message(self, event):
        if self.message_history:
            if self.current_message_index != -1:
                self.current_message_index = min(len(self.message_history) - 1, self.current_message_index + 1)
                self.input_entry.delete(0, ctk.END)
                self.input_entry.insert(0, self.message_history[self.current_message_index])
            elif self.current_message_index == -1 and self.current_message:
                self.input_entry.delete(0, ctk.END)
                self.input_entry.insert(0, self.current_message)
                self.current_message = ""

if __name__ == "__main__":
    root = ctk.CTk()
    app = ChatApp(root)
    app.root = root
    root.mainloop()