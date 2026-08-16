import { ref, onMounted, onBeforeUnmount } from "vue";

export const useStatisticsCounter = () => {
  const completedProjects = ref(0);
  const happyClients = ref(0);
  const yearsExperience = ref(0);

  let observer = null;
  let hasAnimated = false;

  const animateValue = (target, state, duration = 1500) => {
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;

      const progress = Math.min(elapsed / duration, 1);

      state.value = Math.floor(target * progress);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        state.value = target;
      }
    };

    requestAnimationFrame(update);
  };

  const startCounters = () => {
    if (hasAnimated) {
      return;
    }

    hasAnimated = true;

    animateValue(150, completedProjects);

    animateValue(100, happyClients);

    animateValue(10, yearsExperience);
  };

  onMounted(() => {
    const statisticsSection = document.getElementById("statistics");

    if (!statisticsSection) {
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCounters();

            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.3,
      },
    );

    observer.observe(statisticsSection);
  });

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  return {
    completedProjects,
    happyClients,
    yearsExperience,
  };
};
