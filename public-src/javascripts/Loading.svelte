<style>
    @keyframes loading {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
	}
    .container {
        padding: 1rem;
        width: 100%;
        height: 100%;
    }
    .indicator {
        margin: 0 auto;
        height: 3rem;
        width: 3rem;
        border-radius: 100%;
        border: 1px solid #00B7FF;
        border-right-color: transparent;
        animation: loading 0.6s infinite linear;
    }
</style>
<div class="container">
    <div class="indicator"></div>
</div>