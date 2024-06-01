import json
import numpy as np

class SnakeGame:
    def __init__(self, width, height, cell_size):
        self.width = width
        self.height = height
        self.cell_size = cell_size
        self.reset()

    def reset(self):
        self.snake = [{'x': 5, 'y': 5}]
        self.apple = {'x': np.random.randint(0, self.width // self.cell_size),
                      'y': np.random.randint(0, self.height // self.cell_size)}
        self.direction = 'right'
        self.game_over = False

    def update_snake(self):
        if self.game_over:
            return

        head = self.snake[-1].copy()
        
        if self.direction == 'left':
            head['x'] -= 1
        elif self.direction == 'right':
            head['x'] += 1
        elif self.direction == 'up':
            head['y'] -= 1
        elif self.direction == 'down':
            head['y'] += 1

        self.snake.append(head)

        if head == self.apple:
            self.apple = {'x': np.random.randint(0, self.width // self.cell_size),
                          'y': np.random.randint(0, self.height // self.cell_size)}
        else:
            self.snake.pop(0)

        if head['x'] < 0 or head['y'] < 0 or head['x'] >= self.width // self.cell_size or head['y'] >= self.height // self.cell_size or self.snake_collision(head):
            self.game_over = True

    def snake_collision(self, head):
        for segment in self.snake[:-1]:
            if segment == head:
                return True
        return False

    def turn(self, direction):
        if (direction == 'left' and self.direction != 'right') or (direction == 'right' and self.direction != 'left') or (direction == 'up' and self.direction != 'down')  or (direction == 'down' and self.direction != 'up'):
            self.direction = direction

    def update_with_touch(self, touchX, touchY):
        canvas_center_x = self.width // 2
        canvas_center_y = self.height // 2

        if touchX < canvas_center_x and self.direction != 'right':
            self.turn('left')
        elif touchX > canvas_center_x and self.direction != 'left':
            self.turn('right')
        elif touchY < canvas_center_y and self.direction != 'down':
            self.turn('up')
        elif touchY > canvas_center_y and self.direction != 'up':
            self.turn('down')

    def get_state(self):
        return json.dumps({
            'snake': self.snake,
            'apple': self.apple,
            'game_over': self.game_over,
            'direction': self.direction  # include the new direction
        })

game = SnakeGame(400, 400, 20)

def update_game(direction):
    if direction:
        game.turn(direction)
    game.update_snake()
    return game.get_state()

def update_touch(touchX, touchY):
    game.update_with_touch(touchX, touchY)
    game.update_snake()
    return game.get_state()

def reset_game():
    game.reset()
    return game.get_state()