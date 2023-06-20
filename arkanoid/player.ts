export default class Player {
  private score = 0;
  private lives = 3;

  addScore(score: number) {
    this.score += score;
  }

  getScore() {
    return this.score;
  }

  increaseLives() {
    this.lives++;
  }

  decreaseLives() {
    this.lives--;
  }

  getLives() {
    return this.lives;
  }
}
