-- Grupo 5 INMUEBLE - CAZAIMUEBLES - David Naranjo, Jimmy Erazo, Daniel Kure
-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-06-2024 a las 13:08:00
-- Versión del servidor: 10.4.21-MariaDB
-- Versión de PHP: 7.3.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `inmueble`
--
CREATE DATABASE IF NOT EXISTS `inmueble` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `inmueble`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `catalogo`
--

CREATE TABLE `catalogo` (
  `id` int(11) NOT NULL,
  `precio` float NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `tipo` int(11) NOT NULL,
  `ubicacion` varchar(120) NOT NULL,
  `publisher` int(11) DEFAULT NULL,
  `fecha` datetime NOT NULL,
  `descripcion` varchar(300) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `catalogo`
--

INSERT INTO `catalogo` (`id`, `precio`, `nombre`, `tipo`, `ubicacion`, `publisher`, `fecha`, `descripcion`, `image_url`) VALUES
(1, 120000000, 'Apartamento 200mc Zona Rosa Cali', 1, 'Calle 50, Villa Colombia, Comuna 8, Perímetro Urbano Santiago de Cali, Cali', 3, '2024-06-03 23:49:44', 'Este apartamento de 200m² en la exclusiva Zona Rosa de Cali ofrece 3 amplias habitaciones, 2 baños, cocina moderna, sala-comedor, balcón con vista panorámica y seguridad 24/7. Perfecto para disfrutar de la vibrante vida nocturna y excelentes restaurantes.\r\n', 'zonar.png;zonar2.png'),
(2, 280000000, 'Apartamento 2 Pisos 100mc Cali', 1, 'Carrera 27, Viejo San Fernando, Comuna 19, Perímetro Urbano Santiago de Cali', 3, '2024-06-08 07:21:07', 'Moderno apartamento dúplex de 100m² en Cali, cuenta con 2 habitaciones, 2 baños, sala-comedor, cocina integral, y estudio. Ubicado en una tranquila zona residencial cerca de centros comerciales y colegios, ideal para familias jóvenes.\r\n', 'doblepiso.png'),
(3, 720000000, 'Propiedad Comercial concreto reves enfatizado', 3, 'Calle 83 Carrera 22 UPZ Localidad Usaquen Bogota', 2, '2024-06-10 22:26:45', 'Espacio comercial de 150m² en Bogotá, construido con concreto reves enfatizado. Ofrece una planta abierta versátil, baño, y vitrina a la calle principal. Excelente ubicación para negocios, con alta afluencia de público y fácil acceso a transporte.\r\n', 'revesenfatizado.png;revesenfatizadop.png;revesenfatizadoi.png'),
(4, 450000000, 'Propiedad Residencial Norte Ciudad', 3, 'Carrera 70 Calle 119 UPZ Niza Bogota', 1, '2024-06-19 00:31:42', 'ejemplo descripcion', '8-KLg59JeGzTelrAv.png;8-C5wbTRQc2dQqpNC.png;8-TuGz9rLZ919z1EA.png'),
(5, 390000000, 'Propiedad doble piso nuevo residencial', 1, 'Calle 70 Carrera 28 Comuna 12 Cali ', 3, '2024-06-19 01:52:56', 'Apartamento de piso doble con acabado de interiores en zona residencial\r\n#habitaciones: 3 Base concreto solido grueso y galvanizado sincronico industrial', '8-uiwzzVUTCOcfZPa.png;8-iMGYAhIPKVfYSFA.png;8-UKwlXQcih0uadqI.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publishers`
--

CREATE TABLE `publishers` (
  `idpublisher` int(11) NOT NULL,
  `nombrepublisher` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `publishers`
--

INSERT INTO `publishers` (`idpublisher`, `nombrepublisher`) VALUES
(1, 'Propiedades Generales'),
(2, 'Inmobiliaria Agustino'),
(3, 'Apartamentos Leviathan');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes`
--

CREATE TABLE `solicitudes` (
  `id` int(11) NOT NULL,
  `nombre_agente` varchar(50) NOT NULL,
  `propiedad` varchar(100) NOT NULL,
  `nombre_cliente` varchar(50) NOT NULL,
  `tel_cliente` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `solicitudes`
--

INSERT INTO `solicitudes` (`id`, `nombre_agente`, `propiedad`, `nombre_cliente`, `tel_cliente`) VALUES
(2, 'Camilo', 'Apartamento 200mc Zona Rosa Cali', 'Armando Casas', '2147483647');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos`
--

CREATE TABLE `tipos` (
  `idtipo` int(11) NOT NULL,
  `nombretipo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tipos`
--

INSERT INTO `tipos` (`idtipo`, `nombretipo`) VALUES
(1, 'Apartamento'),
(2, 'Casa'),
(3, 'Edificio'),
(4, 'Finca raiz');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(20) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(200) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `fullname`, `correo`) VALUES
(1, 'Admin', 'pbkdf2:sha256:600000$a3cbcfYtG7Y4NMJG$566a66e602e15eae49254222efcf780e88fea5804a06c72e3053188428adbdef', 'Admin Procesos', 'admin@correo.com'),
(2, 'Elias', 'pbkdf2:sha256:600000$a3cbcfYtG7Y4NMJG$566a66e602e15eae49254222efcf780e88fea5804a06c72e3053188428adbdef', 'Elias - Inmobiliaria Agustino', 'elias2bal@correo.com'),
(3, 'Camilo', 'pbkdf2:sha256:600000$ICbd95GVmcWPm1zz$82fce3b6ce68ddd13023ab72f659d95a12d8782fa5dec89ddcdc2a2e37db0bcb', 'Camilo - Apartamentos Leviathan', 'camilorep@correo.com'),
(4, 'Isaias', 'pbkdf2:sha256:600000$mar6D2bOLTZOp1vK$ff5b8192c3f1af38aa88f51a2218fc2c46fd69d9cfd261c681644b3249551da3', 'Isaias-Apartamentos Leviathan', 'isaias26@mail.com'),
(5, 'hola', 'pbkdf2:sha256:600000$g87qJhc2ASjksSvZ$3adfd28cbdf956ff9aaec78c5a86984c4ee45e5c8e939c329da3b4bf85340ead', 'Hola contraseña hola123', 'hola1@gmail.com');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `catalogo`
--
ALTER TABLE `catalogo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tipo` (`tipo`),
  ADD KEY `fk_publisher` (`publisher`);

--
-- Indices de la tabla `publishers`
--
ALTER TABLE `publishers`
  ADD PRIMARY KEY (`idpublisher`);

--
-- Indices de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tipos`
--
ALTER TABLE `tipos`
  ADD PRIMARY KEY (`idtipo`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `catalogo`
--
ALTER TABLE `catalogo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `publishers`
--
ALTER TABLE `publishers`
  MODIFY `idpublisher` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tipos`
--
ALTER TABLE `tipos`
  MODIFY `idtipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--ALTER TABLE `solicitudes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `catalogo`
--
ALTER TABLE `catalogo`
  ADD CONSTRAINT `fk_publisher` FOREIGN KEY (`publisher`) REFERENCES `publishers` (`idpublisher`),
  ADD CONSTRAINT `fk_tipo` FOREIGN KEY (`tipo`) REFERENCES `tipos` (`idtipo`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
