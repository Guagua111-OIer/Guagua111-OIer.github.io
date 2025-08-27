// 鼠标点击烟花特效
document.addEventListener('click', function(e) {
  // 创建粒子容器
  const particlesContainer = document.createElement('div');
  particlesContainer.style.position = 'fixed';
  particlesContainer.style.top = '0';
  particlesContainer.style.left = '0';
  particlesContainer.style.pointerEvents = 'none';
  particlesContainer.style.zIndex = '9999';
  document.body.appendChild(particlesContainer);
  
  // 粒子数量
  const particleCount = 15;
  // 粒子颜色集合
  const colors = ['#ff3838', '#ffb8b8', '#ff9d9d', '#ff6b6b', '#ff4757', '#ff6348', '#ff7f50', '#ffA502', '#ffc107', '#ffd700'];
  
  // 创建粒子
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    
    // 随机大小
    const size = Math.random() * 8 + 4;
    
    // 设置粒子样式
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.borderRadius = '50%';
    particle.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px ${particle.style.backgroundColor}`;
    particle.style.left = `${e.clientX}px`;
    particle.style.top = `${e.clientY}px`;
    particle.style.opacity = '1';
    particle.style.pointerEvents = 'none';
    
    // 添加到容器
    particlesContainer.appendChild(particle);
    
    // 随机方向和距离
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 80 + 40;
    
    // 计算终点位置
    const endX = e.clientX + Math.cos(angle) * distance;
    const endY = e.clientY + Math.sin(angle) * distance;
    
    // 动画持续时间
    const duration = Math.random() * 600 + 800;
    
    // 动画效果
    const start = performance.now();
    function animate(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // 缓动函数 - 先快后慢
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      // 计算当前位置
      const currentX = e.clientX + Math.cos(angle) * distance * easeProgress;
      const currentY = e.clientY + Math.sin(angle) * distance * easeProgress;
      
      // 更新位置和透明度
      particle.style.left = `${currentX}px`;
      particle.style.top = `${currentY}px`;
      particle.style.opacity = `${1 - progress}`;
      
      // 继续动画
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // 动画结束，移除粒子
        particle.remove();
        
        // 如果是最后一个粒子，移除容器
        if (i === particleCount - 1) {
          setTimeout(() => {
            particlesContainer.remove();
          }, duration);
        }
      }
    }
    
    // 开始动画
    requestAnimationFrame(animate);
  }
});
