from app import create_app, socket

app = create_app()

if __name__ == '__main__':
    socket.run(app)
