from django.db import models

class TechStackCard(models.Model):
    name = models.CharField(max_length=100)
    stacks = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}'s Tech Stack Card"
